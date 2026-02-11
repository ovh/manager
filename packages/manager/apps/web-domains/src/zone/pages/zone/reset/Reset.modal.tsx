export interface ResetModalProps {
  onCloseCallback?: () => void;
  onSuccessCallback?: () => void;
}

export default function ResetModal({ onCloseCallback, onSuccessCallback }: ResetModalProps = {}) {
    return <div>ResetModal</div>;
}