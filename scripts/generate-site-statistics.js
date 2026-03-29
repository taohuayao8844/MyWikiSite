const fs = require('fs')
const path = require('path')

const projectRootPath = path.resolve(__dirname, '..')
const contentDirectoryPathList = [
  path.join(projectRootPath, 'docs'),
  path.join(projectRootPath, 'blog'),
]
const outputFilePath = path.join(
  projectRootPath,
  'src',
  'data',
  'site-statistics.json'
)
const markdownFilePattern = /\.(md|mdx)$/i
const millisecondsPerDay = 24 * 60 * 60 * 1000

function collectMarkdownFilePathList(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return []
  }

  const entryNameList = fs.readdirSync(directoryPath, { withFileTypes: true })
  const markdownFilePathList = []

  for (const entry of entryNameList) {
    const entryPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      markdownFilePathList.push(...collectMarkdownFilePathList(entryPath))
      continue
    }

    if (entry.isFile() && markdownFilePattern.test(entry.name)) {
      markdownFilePathList.push(entryPath)
    }
  }

  return markdownFilePathList
}

function extractFrontMatter(rawContent) {
  const frontMatterMatchResult = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!frontMatterMatchResult) {
    return ''
  }

  return frontMatterMatchResult[1]
}

function extractDateFromFrontMatter(frontMatterContent) {
  const dateMatchResult = frontMatterContent.match(
    /^date:\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2}(?:[ T][^"'\n]+)?)["']?\s*$/m
  )

  return dateMatchResult ? dateMatchResult[1] : null
}

function parseStatisticDate(dateValue, fallbackDate) {
  if (!dateValue) {
    return fallbackDate
  }

  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return fallbackDate
  }

  return parsedDate
}

function stripFrontMatter(rawContent) {
  return rawContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

function countReadableCharacters(rawContent) {
  const contentWithoutFrontMatter = stripFrontMatter(rawContent)
  const contentWithoutCodeBlock = contentWithoutFrontMatter
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]+`/g, ' ')
  const plainTextContent = contentWithoutCodeBlock
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~\-|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!plainTextContent) {
    return 0
  }

  return plainTextContent.replace(/\s/g, '').length
}

function formatDayDistance(targetDate, nowDate) {
  const dayDistance = Math.max(
    0,
    Math.floor((nowDate.getTime() - targetDate.getTime()) / millisecondsPerDay)
  )

  if (dayDistance === 0) {
    return 'Today'
  }

  if (dayDistance === 1) {
    return '1 day ago'
  }

  return `${dayDistance} days ago`
}

function formatRuntime(startDate, nowDate) {
  const runtimeDayCount =
    Math.max(
      0,
      Math.floor((nowDate.getTime() - startDate.getTime()) / millisecondsPerDay)
    ) + 1

  return `${runtimeDayCount} days`
}

function formatTotalCount(totalCharacterCount) {
  if (totalCharacterCount >= 10000) {
    return `${(totalCharacterCount / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }

  return `${totalCharacterCount}`
}

function buildSiteStatistics() {
  const markdownFilePathList = contentDirectoryPathList.flatMap(
    collectMarkdownFilePathList
  )
  const nowDate = new Date()

  const articleMetadataList = markdownFilePathList.map((filePath) => {
    const rawContent = fs.readFileSync(filePath, 'utf8')
    const fileStat = fs.statSync(filePath)
    const fallbackDate = fileStat.mtime
    const frontMatterContent = extractFrontMatter(rawContent)
    const articleDate = parseStatisticDate(
      extractDateFromFrontMatter(frontMatterContent),
      fallbackDate
    )
    const readableCharacterCount = countReadableCharacters(rawContent)

    return {
      filePath,
      articleDate,
      readableCharacterCount,
      updatedAt: fileStat.mtime,
    }
  })

  if (articleMetadataList.length === 0) {
    return {
      generatedAt: nowDate.toISOString(),
      articleCount: 0,
      runtime: '0 days',
      totalCount: '0',
      lastUpdate: 'No articles',
    }
  }

  const sortedArticleMetadataList = [...articleMetadataList].sort(
    (leftArticleMetadata, rightArticleMetadata) =>
      leftArticleMetadata.articleDate.getTime() -
      rightArticleMetadata.articleDate.getTime()
  )

  const firstArticleDate = sortedArticleMetadataList[0].articleDate
  const latestArticleDate =
    sortedArticleMetadataList[sortedArticleMetadataList.length - 1].articleDate
  const totalCharacterCount = articleMetadataList.reduce(
    (sum, articleMetadata) => sum + articleMetadata.readableCharacterCount,
    0
  )

  return {
    generatedAt: nowDate.toISOString(),
    articleCount: articleMetadataList.length,
    runtime: formatRuntime(firstArticleDate, nowDate),
    totalCount: formatTotalCount(totalCharacterCount),
    lastUpdate: formatDayDistance(latestArticleDate, nowDate),
  }
}

function ensureOutputDirectoryExists() {
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true })
}

function writeStatisticsFile() {
  const siteStatistics = buildSiteStatistics()
  ensureOutputDirectoryExists()
  fs.writeFileSync(outputFilePath, `${JSON.stringify(siteStatistics, null, 2)}\n`)
  console.log(`Generated site statistics: ${outputFilePath}`)
}

writeStatisticsFile()
