// App.js
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import DatePicker from "react-datepicker";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const App = () => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: ""
  });

  const [allEvents, setAllEvents] = useState(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    return storedEvents
      ? JSON.parse(storedEvents).map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      : [];
  });

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(allEvents));
  }, [allEvents]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all fields.");
      return;
    }

    if (newEvent.start > newEvent.end) {
      alert("Start date cannot be after end date.");
      return;
    }

    const start = new Date(newEvent.start);
    const end = new Date(newEvent.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    setAllEvents([...allEvents, { ...newEvent, start, end }]);
    setNewEvent({ title: "", start: "", end: "" });
  };

  return (
    <div className="App">
      <h1>Welcome to Shedula👋</h1>
      <h2>Add New Event</h2>
      <div>
        <input
          type="text"
          placeholder="Add Title"
          style={{ width: "20%", marginRight: "10px" }}
          value={newEvent.title}
          onChange={(e) =>
            setNewEvent({ ...newEvent, title: e.target.value })
          }
        />

        <DatePicker
          placeholderText="Start Date"
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
          style={{ marginRight: "10px" }}
        />

        <DatePicker
          placeholderText="End Date"
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
        />

        <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
          Add Event
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month", "week", "day"]}
        style={{ height: 500, margin: "50px auto", maxWidth: "90%" }}
        popup
      />

    </div>
  );
};

export default App;
