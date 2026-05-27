import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { error, isError, isPending, data } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeletion,
    error: errorDeletion,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  function startDeleting() {
    setIsDeleting(true);
  }

  function stopDeleting() {
    setIsDeleting(false);
  }

  function handleDelete() {
    mutate({ id });
  }

  let content = "";

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }
  if (isError) {
    content = (
      <ErrorBlock
        title={"An error accuard"}
        message={error.info?.message || "failed to fetch data"}
      />
    );
  }
  let date;
  if (data) {
    date = new Date(data.date).toLocaleDateString("en", {
      month: "short",
      day: "2-digit",
      year: "2-digit",
    });
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={stopDeleting}>
          <h2>deleting data</h2>
          <p>are you sure?</p>

          <div>
            {isPendingDeletion && <p>pending ...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleDelete}>delete</button>
                <button onClick={stopDeleting}>cancel</button>
              </>
            )}
            {isErrorDeletion && (
              <ErrorBlock
                title={"Some Thing strange happend"}
                message={errorDeletion.info?.message || "failed to fetch data"}
              />
            )}
          </div>
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      <article id="event-details">
        {!data && content}
        {data && (
          <>
            <header>
              <h1>{data.title}</h1>
              <nav>
                <button onClick={startDeleting}>Delete</button>
                <Link to="edit">Edit</Link>
              </nav>
            </header>
            <div id="event-details-content">
              {isPending ? (
                "loading..."
              ) : (
                <img src={"http://localhost:3000/" + data.image} alt="" />
              )}
              <div id="event-details-info">
                <div>
                  <p id="event-details-location">{data.location}</p>
                  <time dateTime={`Todo-DateT$Todo-Time`}>
                    {" "}
                    {date} @ {data.time}
                  </time>
                </div>
                <p id="event-details-description">{data.description}</p>
              </div>
            </div>
          </>
        )}
      </article>
    </>
  );
}
