import React, { useState, useEffect, useRef } from 'react';
import './MyTimer.css';

function MyTimer() {
  const circleRef = useRef();
  const [circleWidth, setCircleWidth] = useState();

  let digitRefs = useRef(Array(12));
  const [digitDimensions, setDigitDimensions] = useState();

  const [hoursAngleStyle, setHoursAngleStyle] = useState({});
  const [minutesAngleStyle, setMinutesAngleStyle] = useState({});
  const [secondsAngleStyle, setSecondsAngleStyle] = useState({});

  useEffect(() => {
    // We need to get digit and center dimensions in order to
    // correctly place them
    if (circleRef.current) {
      setCircleWidth(circleRef.current.clientWidth);
    }
    if (digitRefs.current && digitRefs.current[0]) {
      let _digitDimensions = [];
      digitRefs.current.forEach((digit) => {
        _digitDimensions.push({
          width: digit.clientWidth,
          height: digit.clientHeight,
        });
      });
      setDigitDimensions(_digitDimensions);
    }
  }, [circleRef, digitRefs]);

  function calcDigitPosition(i) {
    if (!circleWidth || !digitDimensions) {
      return {
        visibility: 'hidden',
      };
    }

    let angle = Math.PI / 2 - (i * Math.PI) / 6;
    let x =
      circleWidth / 2 +
      (0.85 * Math.cos(angle) * circleWidth) / 2 -
      digitDimensions[i - 1].width / 2;
    let y =
      circleWidth / 2 +
      (0.85 * Math.sin(angle) * circleWidth) / 2 -
      digitDimensions[i - 1].height / 2;

    return {
      position: 'absolute',
      left: x,
      bottom: y,
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      hours = hours % 12;
      const hoursMinutes = 5 * hours + (5 * minutes) / 60;
      let hoursAngle = (hoursMinutes * 360) / 60 - 90;
      let minutesAngle = (minutes * 360) / 60 - 90;
      let secondsAngle = (seconds * 360) / 60 - 90;

      setHoursAngleStyle({
        transform: `rotate(${hoursAngle}deg)`,
      });
      setMinutesAngleStyle({
        transform: `rotate(${minutesAngle}deg)`,
      });
      setSecondsAngleStyle({
        transform: `rotate(${secondsAngle}deg)`,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='top'>
      <div ref={circleRef} className='circle'>
        {[...Array(12).keys()].map((i) => (
          <span
            ref={(ref) => (digitRefs.current[i] = ref)}
            className='digit'
            style={calcDigitPosition(i + 1)}
            key={i}
          >
            {i + 1}
          </span>
        ))}
        <span className='center'></span>
        <span className='needle hours' style={hoursAngleStyle}></span>
        <span className='needle minutes' style={minutesAngleStyle}></span>
        <span className='needle seconds' style={secondsAngleStyle}></span>
      </div>
    </div>
  );
}

export default MyTimer;
