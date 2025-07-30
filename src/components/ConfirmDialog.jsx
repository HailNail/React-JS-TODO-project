const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <>
      {/* Modal box */}
      <div className="modal-content-dialog">
        <h2 className="confirm-header">{message}</h2>
        <div className="buttons">
          <button onClick={onConfirm} className="modal-button">
            Yes
          </button>
          <button onClick={onCancel} className="modal-button">
            No
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
