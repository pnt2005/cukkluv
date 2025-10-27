const CreateSelectModal = () => {
  return (
    <div
      className="modal fade"
      id="createSelectModal"
      tabIndex="-1"
      aria-labelledby="createSelectModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3 text-center">
          <h5 className="modal-title mb-3 fw-bold text-warning" id="createSelectModalLabel">
            Create New
          </h5>
          <p>What do you want to create?</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              className="btn btn-outline-warning"
              data-bs-target="#createPostModal"
              data-bs-toggle="modal"
            >
              📝 Post
            </button>
            <button
              className="btn btn-outline-warning"
              data-bs-target="#createRecipeModal"
              data-bs-toggle="modal"
            >
              🍳 Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSelectModal;
