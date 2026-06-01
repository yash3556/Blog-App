import React from 'react';
import './Loader.css';

function Loader({ overlay = false, small = false }) {
  const cls = ['cp-loader'];
  if (overlay) cls.push('cp-loader--overlay');
  if (small) cls.push('cp-loader--small');

  return (
    <div className={cls.join(' ')} aria-hidden="true">
      <div className="cp-spinner" />
    </div>
  );
}

export default Loader;
