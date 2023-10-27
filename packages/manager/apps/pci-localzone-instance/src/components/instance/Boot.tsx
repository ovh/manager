interface BootProps {
  instance: { id: string };
  onClose: CallableFunction;
}

export default function Boot({ instance, onClose }: BootProps) {
  return (
    <>
      Boot instance {instance.id}
      <button onClick={() => onClose()}>Close</button>
    </>
  );
}
