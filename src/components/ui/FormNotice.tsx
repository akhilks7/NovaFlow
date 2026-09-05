import { AlertIcon, CheckCircleIcon } from "@/components/ui/icons";
import type { ActionState } from "@/utils/types";

/**
 * Renders whichever half of an `ActionState` is set. Announced politely so
 * screen readers hear the result of a submission without losing focus.
 */
export function FormNotice({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="notice notice--error" role="alert">
        <AlertIcon size={17} />
        {state.error}
      </p>
    );
  }

  if (state.notice) {
    return (
      <p className="notice notice--success" aria-live="polite">
        <CheckCircleIcon size={17} />
        {state.notice}
      </p>
    );
  }

  return null;
}
