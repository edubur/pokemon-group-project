"use client";

import { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateProfilePictureAction,
  clearProfilePictureAction,
} from "../actions";
import { ProfilePictureFormState } from "../types";
import { SubmitButton } from "@/shared/components/ui/SubmitButton";

// Clear Button
function ClearButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-ghost text-amber-200/80 hover:text-yellow-400 border border-yellow-500/20"
    >
      {pending ? "Clearing..." : "Clear Picture"}
    </button>
  );
}

// Avatar Upload Modal
export default function AvatarUploadModal({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  // Initial state for form actions
  const initialState: ProfilePictureFormState = {
    success: false,
    message: null,
  };

  // Action state for uploading a new profile picture
  const [uploadState, uploadAction] = useActionState(
    updateProfilePictureAction,
    initialState
  );

  // Action state for clearing the profile picture
  const [clearState, clearAction] = useActionState(
    clearProfilePictureAction,
    initialState
  );

  // Ref for form element to reset after success
  const formRef = useRef<HTMLFormElement>(null);

  // Close modal and reset form if either action succeeds
  useEffect(() => {
    if (uploadState.success || clearState.success) {
      formRef.current?.reset();
      dialogRef.current?.close();
    }
  }, [uploadState.success, clearState.success, dialogRef]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box relative bg-gray-900/70 border border-yellow-500/20 backdrop-blur-md shadow-xl text-amber-200/80 rounded-xl">
        {/* Modal Title */}
        <h3 className="font-bold text-lg mb-4 text-yellow-400 drop-shadow-lg">
          Update Profile Picture
        </h3>

        {/* File upload form */}
        <form id="upload-form" ref={formRef} action={uploadAction}>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            className="file-input file-input-bordered w-full mb-4 border-yellow-400/40 bg-gray-800/50 text-amber-200/80 placeholder-amber-400/50 focus:border-yellow-400 focus:ring-yellow-400/40"
          />
        </form>

        {/* Modal actions clear, cancel and upload */}
        <div className="modal-action flex flex-wrap gap-2 justify-end">
          {/* Clear profile picture button */}
          <form action={clearAction}>
            <ClearButton />
          </form>

          {/* Cancel button closes the modal */}
          <form method="dialog">
            <button className="btn btn-ghost border border-yellow-500/20 text-amber-200/80 hover:text-yellow-400">
              Cancel
            </button>
          </form>

          {/* Submit Button */}
          <SubmitButton
            label="Upload"
            loadingLabel="Uploading..."
            form="upload-form"
          />
        </div>

        {/* Error messages if upload/clear fails */}
        {uploadState.message && !uploadState.success && (
          <p className="text-error mt-2">{uploadState.message}</p>
        )}
        {clearState.message && !clearState.success && (
          <p className="text-error mt-2">{clearState.message}</p>
        )}
      </div>

      {/* Closes the modal when clicked outside window */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
