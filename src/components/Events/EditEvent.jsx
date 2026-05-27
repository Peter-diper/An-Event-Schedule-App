import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  function handleSubmit(formData) {}
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["event", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <p className="center">
        <LoadingIndicator />
      </p>
    );
  }
  if (isError) {
    content = (
      <>
        <ErrorBlock
          title={"Could not fetch"}
          message={
            error.info?.message || "failed to fetch data please try again"
          }
        />
        <div className="form-actions">
          <Link to="/" className="button">
            Okey
          </Link>
        </div>
      </>
    );
  }

  if (data)
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );

  return <Modal onClose={handleClose}>{content}</Modal>;
}
