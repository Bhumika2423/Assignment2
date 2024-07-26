import React, { useState, useEffect, CSSProperties } from 'react';
import { IconContext, Circle } from 'phosphor-react';
import styles from './Slider.module.scss';

type SliderProps = {
  type: 'Continuous' | 'Discreet';
  subtype: 'Single' | 'Range';
  numberOfSteps?: number;
  handleSize: 'Size_24' | 'Size_32';
  onChange?: (value: number | [number, number]) => void;
};

const Slider: React.FC<SliderProps> = ({
  type,
  subtype,
  numberOfSteps = 1,
  handleSize,
  onChange,
}) => {
  const [value, setValue] = useState<number | [number, number]>(0);
  const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (subtype === 'Single') {
      setValue(0);
    } else if (subtype === 'Range') {
      setValue([0, 100]);
    }
  }, [type, subtype]);

  const handleMouseDown = (handle: 'start' | 'end') => () => {
    setDraggingHandle(handle);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingHandle) return;

    const trackElement = document.querySelector(`.${styles.track}`);
    if (trackElement) {
      const rect = trackElement.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      let newValue = (offsetX / rect.width) * 100;

      if (type === 'Discreet') {
        newValue = Math.round(newValue / (100 / (numberOfSteps - 1))) * (100 / (numberOfSteps - 1));
      }

      if (Array.isArray(value)) {
        if (draggingHandle === 'start') {
          const newRangeValue: [number, number] = [Math.min(newValue, value[1]), value[1]];
          setValue(newRangeValue);
          if (onChange) onChange(newRangeValue);
        } else {
          const newRangeValue: [number, number] = [value[0], Math.max(newValue, value[0])];
          setValue(newRangeValue);
          if (onChange) onChange(newRangeValue);
        }
      } else {
        setValue(newValue);
        if (onChange) onChange(newValue);
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingHandle(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (draggingHandle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingHandle]);

  const handleStyles = (position: number): CSSProperties => ({
    width: handleSize === 'Size_24' ? '24px' : '32px',
    height: handleSize === 'Size_24' ? '24px' : '32px',
    top: handleSize === 'Size_24' ? '-12px' : '-16px',
    left: `${position}%`,
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Ensure background is transparent to see the Circle
    borderRadius: '50%', // Makes sure it's circular
    zIndex: 1,
  });

  const fillStyles = (start: number, end: number): CSSProperties => ({
    left: `${start}%`,
    width: `${end - start}%`,
  });

  return (
    <div className={styles.slider}>
      <div className={styles.track}>
        {type === 'Discreet' && (
          <div className={styles.steps}>
            {Array.from({ length: numberOfSteps }, (_, index) => (
              <div
                key={index}
                className={styles.step}
                style={{ left: `${(index / (numberOfSteps - 1)) * 100}%` }}
              />
            ))}
          </div>
        )}
        {subtype === 'Range' && Array.isArray(value) && (
          <div className={styles.fill} style={fillStyles(value[0], value[1])} />
        )}
        {subtype === 'Single' && typeof value === 'number' && (
          <div className={styles.fill} style={fillStyles(0, value)} />
        )}
        {subtype === 'Range' ? (
          <>
            <div
              className={styles.handle}
              style={handleStyles(Array.isArray(value) ? value[0] : 0)}
              onMouseDown={handleMouseDown('start')}
            >
              <IconContext.Provider value={{ size: handleSize === 'Size_24' ? '24px' : '32px' }}>
                <Circle weight="fill" />
              </IconContext.Provider>
            </div>
            <div
              className={styles.handle}
              style={handleStyles(Array.isArray(value) ? value[1] : 100)}
              onMouseDown={handleMouseDown('end')}
            >
              <IconContext.Provider value={{ size: handleSize === 'Size_24' ? '24px' : '32px' }}>
                <Circle weight="fill" />
              </IconContext.Provider>
            </div>
          </>
        ) : (
          <div
            className={styles.handle}
            style={handleStyles(typeof value === 'number' ? value : 0)}
            onMouseDown={handleMouseDown('start')}
          >
            <IconContext.Provider value={{ size: handleSize === 'Size_24' ? '24px' : '32px' }}>
              <Circle weight="fill" />
            </IconContext.Provider>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
