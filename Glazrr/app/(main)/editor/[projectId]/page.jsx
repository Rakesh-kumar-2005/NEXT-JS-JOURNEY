"use client";

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Editor = () => {
  const params = useParams(); // returns an object of route params
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    if (params?.projectId) {
      setProjectId(params.projectId);
    }
  }, [params]);

  return (
    <div>
      Editor: {projectId}
    </div>
  );
};

export default Editor;
