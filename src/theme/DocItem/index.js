import React from 'react';
import DocItem from '@theme-original/DocItem';

export default function DocItemWrapper(props) {
  // 从props中获取metadata，description在metadata.content.meta中
  const { frontMatter } = props;
  const description = frontMatter?.description;

  return (
    <>
      {description && (
        <div className="doc-item-description">
          <p>{description}</p>
        </div>
      )}
      <DocItem {...props} />
    </>
  );
}
