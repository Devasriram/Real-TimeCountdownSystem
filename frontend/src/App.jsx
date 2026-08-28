import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");

  // Fetch event deadline from FastAPI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/events/registration-deadline")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        return response.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load registration deadline");
      });
  }, []);

  // Calculate countdown
  useEffect(() => {
    if (!event) {
      return;
    }

    const deadline = new Date(
      event.registration_deadline
    ).getTime();

    const calculateTimeLeft = () => {
      const currentTime = Date.now();

      const difference = deadline - currentTime;

      if (difference <= 0) {
        setExpired(true);

        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return true;
      }

      const totalSeconds = Math.floor(difference / 1000);

      const days = Math.floor(
        totalSeconds / (24 * 60 * 60)
      );

      const hours = Math.floor(
        (totalSeconds % (24 * 60 * 60)) / (60 * 60)
      );

      const minutes = Math.floor(
        (totalSeconds % (60 * 60)) / 60
      );

      const seconds = totalSeconds % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });

      return false;
    };

    const isExpired = calculateTimeLeft();

    let timer;

    if (!isExpired) {
      timer = setInterval(() => {
        const expiredNow = calculateTimeLeft();

        if (expiredNow) {
          clearInterval(timer);
        }
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [event]);

  if (error) {
    return (
      <div className="page">
        <div className="countdown-card">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page">
        <div className="countdown-card">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // Format deadline for display
  const formattedDeadline = new Date(
    event.registration_deadline
  ).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="page">
      <div className="countdown-card">

        <h1>{event.event_name}</h1>

        <p className="subtitle">
          Registration closes on
        </p>

        <p className="deadline">
          {formattedDeadline}
        </p>

        {expired ? (
          <div className="closed">
            <h2>Registration Closed</h2>
            <p>
              The registration deadline has passed.
            </p>
          </div>
        ) : (
          <>
            <h2 className="countdown-title">
              Registration Closes In
            </h2>

            {timeLeft && (
              <div className="countdown">

                <div className="time-box">
                  <span>{String(timeLeft.days).padStart(2, "0")}</span>
                  <small>Days</small>
                </div>

                <div className="separator">:</div>

                <div className="time-box">
                  <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                  <small>Hours</small>
                </div>

                <div className="separator">:</div>

                <div className="time-box">
                  <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <small>Minutes</small>
                </div>

                <div className="separator">:</div>

                <div className="time-box">
                  <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <small>Seconds</small>
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default App;