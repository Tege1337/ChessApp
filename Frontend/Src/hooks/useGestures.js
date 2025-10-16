import { useState, useCallback } from 'react';

export function useGestures({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}