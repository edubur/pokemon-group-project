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
  const initialState: ProfilePictureFormState = {
    success: false,
    message: null,
  };

  const [uploadState, uploadAction] = useActionState(
    updateProfilePictureAction,
    initialState
  );

  const [clearState, clearAction] = useActionState(
    clearProfilePictureAction,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (uploadState.success || clearState.success) {
      formRef.current?.reset();
      dialogRef.current?.close();
    }
  }, [uploadState.success, clearState.success, dialogRef]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box relative bg-gray-900/70 border border-yellow-500/20 backdrop-blur-md shadow-xl text-amber-200/80 rounded-xl">
        <h3 className="font-bold text-lg mb-4 text-yellow-400 drop-shadow-lg">
          Update Profile Picture
        </h3>

        <form id="upload-form" ref={formRef} action={uploadAction}>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            className="file-input file-input-bordered w-full mb-4 border-yellow-400/40 bg-gray-800/50 text-amber-200/80 placeholder-amber-400/50 focus:border-yellow-400 focus:ring-yellow-400/40"
          />
        </form>

        <div className="modal-action flex flex-wrap gap-2 justify-end">
          <form action={clearAction}>
            <ClearButton />
          </form>

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

        {uploadState.message && !uploadState.success && (
          <p className="text-error mt-2">{uploadState.message}</p>
        )}
        {clearState.message && !clearState.success && (
          <p className="text-error mt-2">{clearState.message}</p>
        )}
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
