import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Notification from 'rc-notification';
import {Icon, Loading} from '../index';

let defaultDuration = 1.5;
let defaultTop;
let messageInstance;
let key = 1;
let prefixCls = 'mj-message';

function getMessageInstance(isLoading) {
  let loadingStyle = { top: defaultTop };
  if (isLoading) {
    loadingStyle = { top: 0, width: '100%', height: '100%', background: 'transparent' };
  }
  messageInstance = messageInstance || Notification.newInstance({
        prefixCls,
        transitionName: 'move-up',
        style: loadingStyle // 覆盖原来的样式
      });
  return messageInstance;
}

function notice(content, duration = defaultDuration, type, onClose) {
  let iconType = ({
    info: 'edit',
    success: 'selected',
    error: '',
    warning: 'search',
    loading: ''
  })[type];
 const contentStyle=({
   loading:{
     height:'72px',
     width:'168px'
   },
   error: {
     height: '72px',
     minWidth: '168px',
   },
   info:'',
   success: {
     height: '72px',
     minWidth: '168px',
   },
   warning:''
 })[type]
  let instance = getMessageInstance(type === 'loading');

  let style = {};
  if (type === 'loading') {
    style = { top: '25%' };
  }

  instance.notice({
    key,
    duration,
    style: style,
    content: (
      type === 'loading' ?
        <div className={`${prefixCls}-custom-content ${prefixCls}-${type} center`} style={contentStyle}>
          <Loading type="circle" isLoading={true} fillColor={'rgba(255,255,255,0.8)'} msg={content} />
        </div>
        :
        <div className={`${prefixCls}-custom-content ${prefixCls}-${type} center`} style={contentStyle}>
          <Icon type={iconType} />
          <span>{content}</span>
        </div>
    ),
    onClose
  });
  return (function () {
    let target = key++;
    return function () {
      instance.removeNotice(target);
    };
  }());
}

export default {
  info(content, duration, onClose) {
    return notice(content, duration, 'info', onClose);
  },
  success(content, duration, onClose) {
    return notice(content, duration, 'success', onClose);
  },
  error(content, duration, onClose) {
    return notice(content, duration, 'error', onClose);
  },
  // Departed usage, please use warning()
  warn(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  warning(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  loading(content, duration, onClose) {
    return notice(content, duration, 'loading', onClose);
  },
  config(options) {
    if ('top' in options) {
      defaultTop = options.top;
    }
    if ('duration' in options) {
      defaultDuration = options.duration;
    }
    if ('prefixCls' in options) {
      prefixCls = options.prefixCls;
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
};
