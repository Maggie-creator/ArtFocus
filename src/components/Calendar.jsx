// Calendar.jsx
import React, { useEffect } from "react";
import "cally"; // Import cally web component

const Calendar = () => {
  // Just import once on mount
  useEffect(() => {
    // cally is imported already via ES module above
  }, []);

  return (
    <div>
    <calendar-date className="cally bg-base-100 border-base-300 bg-base-100 w-96 p-4 rounded-box" style={{ display: 'block', maxWidth: '320px' }}>
      <svg
        aria-label="Previous"
        className="fill-current size-4"
        slot="previous"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
      </svg>

      <svg
        aria-label="Next"
        className="fill-current size-4"
        slot="next"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
      </svg>

      <calendar-month></calendar-month>
    </calendar-date>
    </div>
  );
};

export default Calendar;
