import { CopyOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useState } from 'react';

function CopyTextButton({
  displayText,
  copyText,
  size,
  wrapperStyle = {},
  position = 'absolute',
}: {
  displayText: string;
  copyText: string;
  size: number | string;
  wrapperStyle?: any;
  position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
}) {
  const [textCopied, setTextCopied] = useState<boolean>(false);

  async function handleCopy() {
    setTextCopied(true);
    if (copyText) {
      await navigator.clipboard.writeText(copyText);
    }
    setTimeout(() => {
      setTextCopied(false);
    }, 2000);
  }

  return (
    <div className="flex-row" style={{ position, ...wrapperStyle }}>
      <button
        className="flex-row flex-between button"
        style={{ ...wrapperStyle, cursor: 'pointer' }}
        onClick={async () => {
          await handleCopy();
        }}
      >
        <span
          className="flex-row white flex-center"
          style={{ fontSize: 'inherit' }}
        >
          {displayText}&nbsp;
        </span>

        <Tooltip
          open={textCopied}
          title={'Copied!'}
          placement="right"
          autoAdjustOverflow={true}
          arrow={false}
          overlayInnerStyle={{
            color: 'black',
            fontFamily: 'Rubik-Bold',
            backgroundColor: 'white',
          }}
        >
          <CopyOutlined size={20} />
        </Tooltip>
      </button>
    </div>
  );
}

export default CopyTextButton;
