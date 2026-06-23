---
title: 电赛ADC采样率设置
description: STM32 HAL库ADC采样率配置、硬件触发、时钟设置与FFT参数联动设计
date: 2026-04-25
tags:
  - HAL
  - ADC
  - 电赛
  - FFT

---

# STM32 HAL库ADC采样率设置与FFT联动

## 一、整体框架

在做FFT频谱分析时，ADC采样率的设置是整个系统的"源头活水"。一个合理的采样率配置需要考虑：

1. **ADC时钟来源** → 确定理论最大采样率
2. **硬件触发源** → 定时器触发确保采样间隔精确
3. **定时器配置** → ARR和PSC决定触发频率
4. **FFT参数联动** → 采样率、点数、分辨率的数学关系
5. **频谱泄漏优化** → 让目标频率落在整数点上

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADC采样系统架构                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│    │ 定时器  │───→│ ADC触发 │───→│ ADC采样 │───→│ DMA传输 │  │
│    │(TIM_XX) │    │ 输入    │    │ 转换    │    │ 到内存  │  │
│    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│         ↑                                               ↓      │
│    ┌─────────┐                                    ┌─────────┐  │
│    │ 时钟树  │                                    │ FFT计算 │  │
│    │(APB2)   │                                    │ arm_fft │  │
│    └─────────┘                                    └─────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 二、ADC时钟选择与总线配置

### 2.1 查看ADC挂在的总线

以STM32F407为例，ADC1/ADC2/ADC3都挂在**APB2总线**上：

```
                          ┌──────────────┐
                          │    AHB      │
                          │   168MHz    │
                          └──────┬───────┘
                                 │
                    ┌────────────┴────────────┐
                    ↓                         ↓
            ┌──────────────┐          ┌──────────────┐
            │    APB1      │          │    APB2      │
            │    42MHz     │          │    84MHz     │  ← ADC挂在这里
            └──────────────┘          └──────┬───────┘
                                             │
                              ┌───────────────┼───────────────┐
                              ↓               ↓               ↓
                           ┌─────┐         ┌─────┐         ┌─────┐
                           │ADC1│         │ADC2│         │ADC3│
                           └─────┘         └─────┘         └─────┘
```

### 2.2 ADC时钟配置

在CubeMX中配置ADC时钟：

1. **时钟源选择**：通常使用APB2分频后的时钟
2. **ADC Prescaler（预分频器）**：可选择 2/4/6/8 分频

```
ADC时钟计算公式：
ADC时钟频率 = APB2总线频率 ÷ ADC_Prescaler

例如：APB2 = 84MHz，Prescaler = 4 → ADC时钟 = 21MHz
```

### 2.3 ADC转换时间

ADC转换时间由**采样时间**和**分辨率**决定：

| 分辨率    | 转换周期 | 采样时间(cycles) | 总时间(21MHz时钟) |
|-----------|----------|------------------|-------------------|
| 12位      | 12       | 3                | 0.71μs            |
| 12位      | 12       | 15               | 1.29μs            |
| 12位      | 12       | 84               | 4.57μs            |
| 10位      | 10       | 84               | 4.48μs            |
| 8位       | 8        | 84               | 4.38μs            |

**最大采样率** ≈ 1 / 单次转换时间（21MHz, 84cycles时 ≈ 250kHz）

---

## 三、ADC硬件触发配置

### 3.1 为什么需要硬件触发？

| 触发方式 | 优点 | 缺点 | 适用场景 |
|---------|------|------|---------|
| 软件触发 | 配置简单 | 间隔不精确，CPU占用高 | 单次采集、低频信号 |
| 定时器触发 | 间隔精确、稳定 | 配置稍复杂 | FFT、周期性采样 |
| DMA循环 | 自动传输、CPU零负担 | 需要DMA配合 | 连续采样 |

### 3.2 定时器触发ADC的配置步骤

#### 步骤1：配置定时器（以TIM2为例）

```c
// CubeMX配置：
// - TIM2时钟源：APB1 (84MHz或42MHz)
// - Prescaler (PSC): 8399  → 计数频率 = 84000000/8400 = 10kHz
// - Counter Period (ARR): 99 → 溢出频率 = 10kHz/(99+1) = 100Hz
// - Trigger Event Selection: Update Event (更新事件触发ADC)
```

#### 步骤2：配置ADC触发源

```c
// CubeMX配置：
// - ADC Mode: Independent mode 或 Multiple mode (根据需求)
// - External Trigger Conversion Source: Timer X Trigger Out event
// - External Trigger Edge: 上升沿触发
```

#### 步骤3：配置DMA传输

```c
// CubeMX配置：
// - DMA Request: ADC1
// - Direction: Peripheral to Memory
// - Mode: Circular (循环模式)
// - Data Width: Half Word (16位ADC)
```

### 3.3 触发频率计算公式

```
触发频率 = 定时器溢出频率 = 定时器时钟频率 / (PSC + 1) / (ARR + 1)

         = ADC采样率 (当每次触发采集一个点时)
```

**示例计算**：

```
目标采样率：10kHz
定时器时钟：84MHz (APB1)
PSC = 8399 → 定时器计数频率 = 84MHz/8400 = 10kHz
ARR = 0    → 10kHz / (0+1) = 10kHz

或：
PSC = 8399, ARR = 0 → 10kHz采样率
PSC = 4199, ARR = 1 → 10kHz采样率
PSC = 2099, ARR = 3 → 10kHz采样率
```

---

## 四、定时器配置详解（ARR与PSC）

### 4.1 定时器时钟来源

| 定时器 | 总线   | 时钟频率(典型值) |
|--------|--------|-----------------|
| TIM1, TIM8  | APB2   | 168MHz / 84MHz  |
| TIM2-TIM5   | APB1   | 84MHz / 42MHz   |
| TIM6, TIM7  | APB1   | 84MHz / 42MHz   |
| TIM9-TIM14  | APB2   | 168MHz / 84MHz  |

> ⚠️ 注意：APB1时钟通常是APB2的一半，需要查看CubeMX时钟配置确认。

### 4.2 ARR和PSC的关系

```
定时器计数频率 = 总线时钟 / (PSC + 1)
定时器溢出频率 = 计数频率 / (ARR + 1) = 总线时钟 / (PSC + 1) / (ARR + 1)
```

**参数说明**：
- **PSC（预分频器）**：将高速总线时钟分频为低速计数时钟
- **ARR（自动重装载值）**：计数器从0计数到这个值后溢出，产生更新事件

### 4.3 常用采样率配置表

以APB1 = 42MHz（TIM2-TIM7）为例：

| 目标采样率 | PSC  | ARR  | 实际采样率 | 误差   |
|-----------|------|------|-----------|--------|
| 10kHz     | 4199 | 0    | 10kHz     | 0%     |
| 10kHz     | 2099 | 1    | 10kHz     | 0%     |
| 50kHz     | 839  | 0    | 50kHz     | 0%     |
| 100kHz    | 419  | 0    | 100kHz    | 0%     |
| 200kHz    | 209  | 0    | 200kHz    | 0%     |
| 1MHz      | 41   | 0    | 1MHz      | 0%     |

---

## 五、FFT参数与采样率联动设计

### 5.1 核心公式回顾

```
频率分辨率:  Δf = Fs / N
频率bin对应: f(k) = k × Δf = k × Fs / N
总采样时长:  Tacq = N / Fs = 1 / Δf
```

**符号说明**：
- `Fs` = 采样率（ADC采样频率）
- `N` = FFT点数（通常取2的整数次幂：256, 512, 1024, 2048...）
- `Δf` = 频率分辨率（相邻两个频谱线之间的间隔）
- `Tacq` = 总采样时长

### 5.2 如何让目标频率落在整数点上？

**频谱泄漏的原因**：当信号频率不正好落在FFT的某个bin上时，能量会"泄漏"到相邻的bin上。

**解决方案**：精心选择Fs和N，使得 `目标频率 / Δf = 整数`

#### 设计步骤

```
目标：准确测量 f_target = 50Hz 的信号

Step 1: 选择合理的采样率 Fs
        Fs > 2 × f_target = 100Hz
        取 Fs = 10240Hz（方便计算）

Step 2: 选择FFT点数 N（2的幂次）
        N = 1024

Step 3: 计算分辨率
        Δf = Fs / N = 10240 / 1024 = 10Hz

Step 4: 验证目标频率是否落在整数点
        k = f_target / Δf = 50 / 10 = 5（整数！）✅

Step 5: 计算总采样时长
        Tacq = N / Fs = 1024 / 10240 = 0.1s = 100ms
```

### 5.3 多目标频率优化示例

**需求**：同时测量 50Hz、100Hz、200Hz 三个频率

```
方案1（不优化）：
  Fs = 10000Hz, N = 1024 → Δf = 9.77Hz
  50Hz: k = 50/9.77 ≈ 5.12 (泄漏严重！)
  100Hz: k = 100/9.77 ≈ 10.24 (泄漏严重！)
  200Hz: k = 200/9.77 ≈ 20.47 (泄漏严重！)

方案2（优化后）：
  选择 Fs = 10240Hz, N = 1024 → Δf = 10Hz
  50Hz: k = 5 (完美！)
  100Hz: k = 10 (完美！)
  200Hz: k = 20 (完美！)
```

### 5.4 常用频率"恰好落点"配置表

以下配置使得对应频率**完美落点**（误差为0）：

| 目标频率 | 推荐采样率(Fs) | FFT点数(N) | 分辨率(Δf) | bin序号(k) | 总时长(Tacq) |
|---------|---------------|-----------|-----------|-----------|-------------|
| 50Hz    | 10240Hz       | 1024      | 10Hz      | 5         | 100ms       |
| 50Hz    | 25600Hz       | 512       | 50Hz      | 1         | 20ms        |
| 60Hz    | 30720Hz       | 512       | 60Hz      | 1         | 16.67ms     |
| 100Hz   | 20480Hz       | 1024      | 20Hz      | 5         | 50ms        |
| 100Hz   | 25600Hz       | 256       | 100Hz     | 1         | 10ms        |
| 1kHz    | 51200Hz       | 512       | 100Hz     | 10        | 10ms        |
| 10kHz   | 102400Hz      | 1024      | 100Hz     | 100       | 10ms        |
| 20kHz   | 102400Hz      | 512       | 200Hz     | 100       | 5ms         |

---

## 六、工程实践速查表

### 6.1 FFT分析推荐配置

| 应用场景 | 目标信号频率 | 推荐采样率 | FFT点数 | 分辨率 | 总时长 | 说明 |
|---------|-------------|-----------|--------|--------|-------|------|
| 工频分析 | 50/60Hz | 10.24kHz | 1024 | 10Hz | 100ms | 精确分析电网频率 |
| 音频分析 | 20Hz-20kHz | 44.1kHz | 2048 | 21.5Hz | 46ms | CD品质采样 |
| 振动分析 | 0-1kHz | 5kHz | 1024 | 4.88Hz | 205ms | 高分辨率 |
| 超声检测 | 40kHz | 200kHz | 1024 | 195Hz | 5.1ms | 高速采样 |
| 脉冲分析 | 任意 | 100kHz | 1024 | 97.7Hz | 10.2ms | 通用配置 |

### 6.2 不同MCU的采样率上限

| MCU型号 | ADC挂载总线 | 总线频率 | ADC最高频率 | 最大采样率(12位) |
|--------|------------|---------|------------|----------------|
| F103   | APB2        | 72MHz   | 14MHz      | ~1MHz          |
| F407   | APB2        | 84MHz   | 36MHz      | ~2.5MHz        |
| F429   | APB2        | 90MHz   | 36MHz      | ~2.5MHz        |
| H743   | AHB         | 200MHz  | 50MHz      | ~6MHz          |

### 6.3 减少频谱泄漏的实用技巧

#### 技巧1：选择合适的采样时长
```
目标：测量100Hz信号
- Tacq = 10ms → Δf = 100Hz → 100Hz正好落点 ✅
- Tacq = 20ms → Δf = 50Hz → 100Hz = 2×Δf 落点 ✅
- Tacq = 15ms → Δf = 66.7Hz → 100Hz ≈ 1.5×Δf 泄漏 ⚠️
```

#### 技巧2：使用窗函数
- **矩形窗**：适合信号正好落点的情况
- **汉宁窗**：适合不知道信号是否落点的情况，抑制旁瓣泄漏
- **布莱克曼窗**：更好的旁瓣抑制，但主瓣更宽

#### 技巧3：加零填充（Zero Padding）
```
原始信号：1024点
加零填充：2048点（后面补1024个0）
效果：频谱插值，分辨率不变，但频谱线更密，便于读数
```

#### 技巧4：多次平均
```
对同一信号进行多次FFT，平均结果
效果：降低噪声，提高信噪比，但不改变分辨率
```

---

## 七、完整配置示例

### 示例：测量50Hz电源信号

**需求**：
- 目标：精确测量50Hz工频信号及其谐波（100Hz, 150Hz, 200Hz...）
- 分辨率要求：≤10Hz（能清晰分辨50Hz相邻信号）
- 采样率：需满足奈奎斯特（>400Hz）

**配置计算**：

```
Step 1: 确定采样率
  抗混叠要求：Fs > 2 × 200Hz(最高谐波) = 400Hz
  留余量：Fs = 10240Hz (10.24kHz)
  
Step 2: 确定FFT点数
  N = 1024 (常用值，平衡计算量与分辨率)
  
Step 3: 验证分辨率
  Δf = Fs / N = 10240 / 1024 = 10Hz
  50Hz → k = 5 ✅ (完美落点)
  100Hz → k = 10 ✅ (完美落点)
  150Hz → k = 15 ✅ (完美落点)
  200Hz → k = 20 ✅ (完美落点)
  
Step 4: 定时器配置 (TIM2, APB1 = 42MHz)
  目标触发频率：10240Hz
  PSC = 4199 → 计数频率 = 42MHz/4200 = 10kHz
  ARR = 0 → 10kHz / 1 = 10kHz ≈ 10240Hz ✅
  
Step 5: 采样时间配置
  ADC_Prescaler = 4 → ADC时钟 = 42MHz/4 = 10.5MHz
  采样周期 = 84Cycles → 转换时间 ≈ 8μs
  满足 1/10.5MHz × 84 ≈ 8μs < 1/10240Hz ≈ 97.7μs ✅
```

**CubeMX配置**：

```
1. 时钟配置：
   - APB1 Prescaler: /4 → 42MHz
   - APB2 Prescaler: /2 → 84MHz (或其他)

2. TIM2配置：
   - Clock Source: Internal Clock
   - Prescaler (PSC): 4199
   - Counter Period (ARR): 0
   - Trigger Event Selection: Update Event
   - Master Mode Selection: Reset Mode (如需级联)

3. ADC1配置：
   - Mode: Independent
   - Clock Prescaler: PCLK2 divided by 4
   - Resolution: 12-bit
   - Scan Conversion Mode: Disabled (单通道)
   - Continuous Conversion Mode: Disabled
   - DMA Continuous Requests: Enabled
   - External Trigger Conversion Source: Timer 2 Trigger Out event
   - External Trigger Edge: Trigger detection on rising edge
   - Sampling Time: 84 Cycles

4. DMA配置：
   - Mode: Circular
   - Direction: Peripheral to Memory
   - Data Width: Half Word
```

---

## 八、代码实现

### 8.1 DMA + 定时器触发ADC初始化

```c
// adc.c 中自动生成的代码（CubeMX）
void MX_ADC1_Init(void)
{
  ADC_ChannelConfTypeDef sConfig = {0};

  // ADC1基础配置
  hadc1.Instance = ADC1;
  hadc1.Init.ClockPrescaler = ADC_CLOCK_SYNC_PCLK_DIV4;  // 4分频
  hadc1.Init.Resolution = ADC_RESOLUTION_12B;
  hadc1.Init.ScanConvMode = DISABLE;                       // 单通道
  hadc1.Init.ContinuousConvMode = DISABLE;                // 关闭连续转换
  hadc1.Init.DiscontinuousConvMode = DISABLE;
  hadc1.Init.ExternalTrigConv = ADC_EXTERNALTRIGCONV_T2_TRGO; // TIM2触发
  hadc1.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_RISING; // 上升沿
  hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  hadc1.Init.NbrOfConversion = 1;
  hadc1.Init.DMAContinuousRequests = ENABLE;                // DMA连续请求
  HAL_ADC_Init(&hadc1);

  // 配置采样通道
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = 1;
  sConfig.SamplingTime = ADC_SAMPLETIME_84CYCLES;          // 84周期采样
  HAL_ADC_ConfigChannel(&hadc1, &sConfig);
}

// TIM2初始化（触发源配置）
void MX_TIM2_Init(void)
{
  TIM_MasterConfigTypeDef sMasterConfig = {0};

  htim2.Instance = TIM2;
  htim2.Init.Prescaler = 4199;         // PSC = 4199
  htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim2.Init.Period = 0;               // ARR = 0
  htim2.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
  HAL_TIM_Base_Init(&htim2);

  // 配置触发输出
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_UPDATE;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  HAL_TIMEx_MasterConfigSynchronization(&htim2, &sMasterConfig);
}
```

### 8.2 FFT处理代码

```c
#include "arm_math.h"
#include "arm_const_structs.h"

#define FFT_LENGTH 1024        // FFT点数
#define ADC_BUFFER_SIZE 1024

uint16_t adc_buffer[ADC_BUFFER_SIZE];  // DMA目标缓冲区
float32_t fft_input[FFT_LENGTH];        // FFT输入（浮点）
float32_t fft_output[FFT_LENGTH];       // FFT输出（幅值）

// FFT计算
void FFT_Calculate(void)
{
    uint32_t i;
    
    // 1. 将ADC原始数据转换为浮点数并归一化
    for(i = 0; i < FFT_LENGTH; i++)
    {
        fft_input[i] = (float32_t)adc_buffer[i] / 4095.0f * 3.3f;  // 归一化到电压值
    }
    
    // 2. 执行FFT（使用ARM DSP库的基4/基2 FFT）
    arm_cfft_f32(
        &arm_cfft_sR_f32_len1024,  // FFT配置结构
        fft_input,                   // 输入/输出数据
        0,                          // 0=FFT, 1=IFFT
        1                           // 正向变换
    );
    
    // 3. 计算幅值谱（实部^2 + 虚部^2）
    arm_abs_f32(fft_input, fft_output, FFT_LENGTH);
    
    // 4. 转换为实际幅值（除以N/2，因为FFT输出是双边谱）
    for(i = 0; i < FFT_LENGTH/2; i++)
    {
        fft_output[i] = fft_output[i] * 2.0f / FFT_LENGTH;
    }
}

// 查找峰值频率
float32_t FFT_Find_Peak_Frequency(float32_t sampling_rate)
{
    uint32_t i;
    float32_t max_val = 0;
    uint32_t max_index = 0;
    float32_t frequency;
    
    // 遍历前半段频谱（0 ~ Fs/2）
    for(i = 1; i < FFT_LENGTH/2; i++)  // 跳过直流分量(i=0)
    {
        if(fft_output[i] > max_val)
        {
            max_val = fft_output[i];
            max_index = i;
        }
    }
    
    // 计算频率（k × Δf）
    frequency = (float32_t)max_index * sampling_rate / FFT_LENGTH;
    
    return frequency;
}
```

### 8.3 主函数调用

```c
int main(void)
{
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();
    MX_DMA_Init();
    MX_ADC1_Init();
    MX_TIM2_Init();
    
    // 启动DMA传输（目标地址为adc_buffer）
    HAL_ADC_Start_DMA(&hadc1, (uint32_t*)adc_buffer, ADC_BUFFER_SIZE);
    
    // 启动定时器（开始触发ADC）
    HAL_TIM_Base_Start(&htim2);
    
    while (1)
    {
        // 等待采样完成（DMA半满或全满中断）
        if(fft_ready_flag)
        {
            FFT_Calculate();
            
            float32_t freq = FFT_Find_Peak_Frequency(10240.0f);
            
            // 打印结果
            printf("Peak Frequency: %.2f Hz\r\n", freq);
            
            fft_ready_flag = 0;
        }
    }
}

// DMA传输完成回调
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef* hadc)
{
    fft_ready_flag = 1;  // 设置FFT计算标志
}
```

---

## 九、常见问题与调试

### Q1: 采样率设置正确，但FFT结果不对
- 检查定时器时钟是否正确（APB1/APB2）
- 确认 `PSC × ARR` 计算无误
- 验证DMA是否工作在循环模式

### Q2: 频谱泄漏严重
- 检查目标频率是否落在整数bin上
- 考虑使用窗函数（汉宁窗）
- 增加FFT点数（提高分辨率）

### Q3: 噪声太大
- 增加采样次数进行平均
- 检查硬件接地和屏蔽
- 降低ADC采样时间（提高采样速度）

### Q4: 无法达到高采样率
- 确认ADC时钟配置正确
- 减少ADC采样周期（Sampling Time）
- 检查DMA优先级和总线占用

---

## 十、总结

ADC采样率的配置是一个系统性工程，需要从以下几个层面考虑：

1. **时钟层面**：确定ADC挂在哪个总线，配置合适的预分频
2. **触发层面**：选择定时器作为触发源，配置ARR和PSC
3. **FFT层面**：根据目标频率设计Fs和N的组合，使频率落在整数点上
4. **实践层面**：通过表格速查和计算器快速确定最优配置

记住核心公式：
```
采样率 Fs → 触发频率
FFT点数 N → 分辨率 Δf = Fs/N
目标频率 f → bin序号 k = f/Δf（尽量取整数）
```

合理的参数设计能大大减少频谱泄漏，提高频率测量的精度！
