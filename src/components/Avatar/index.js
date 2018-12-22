import React from 'react';
import './index.less';

class Avatar extends React.Component {
  static defaultProps = {
    width: 'auto',
    height: 'auto',
  }

  render() {
    const { src, width, style } = this.props;
    return (
      <div className="avatar" style={{ ...style, width, height: width }}>
        <div>
          <img src={src} />
        </div>
      </div>
    );
  }
}

export default Avatar;