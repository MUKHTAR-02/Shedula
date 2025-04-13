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

  const [view, setView] = useState("month"); // Track the current view (month, week, day, agenda)
  const [currentDate, setCurrentDate] = useState(new Date()); // Track current date to navigate

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

  const handleNavigate = (date) => {
    setCurrentDate(date); // Update the current date on navigation (next, back, today)
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

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        view={view} // Set the current view using the state
        views={["month", "week", "day", "agenda"]} // Add agenda view
        onView={(newView) => setView(newView)} // Ensure view updates correctly
        onNavigate={handleNavigate} // Handle navigation (next, back, today)
        date={currentDate} // Set the current date for navigation
        style={{ height: 500, margin: "50px auto", maxWidth: "90%" }}
        popup
      />
    </div>
  );
};

export default App;
