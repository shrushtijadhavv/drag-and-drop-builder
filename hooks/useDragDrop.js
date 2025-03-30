import { useCallback } from 'react';

export const useDragDrop = () => {
  const onDragStart = useCallback((e, elementType) => {
    e.dataTransfer.setData('application/websitesbuilder', elementType);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);
  
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  
  const onDrop = useCallback((e) => {
    e.preventDefault();
    return e.dataTransfer.getData('application/websitesbuilder');
  }, []);
  
  return { onDragStart, onDragOver, onDrop };
};