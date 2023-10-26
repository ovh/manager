import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type BackupData = {
  name: string;
  version: string;
};

export default function BackupCreation() {
  const {
    register, // register form fields
    handleSubmit, // create submit handler
    reset, // reset form
    setFocus, // focus a given field
    watch, // watch for changes on new input
    formState: { errors }, // error handling
  } = useForm<BackupData>({
    // you can initialize form with default values
    defaultValues: {
      version: '1',
    },
  });

  // setFocus allows to focus given form field
  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  // submit handler will receive form data
  const onSubmit: SubmitHandler<BackupData> = (data) => {
    console.log(data);
  };

  // watch allows to watch form changes
  const watchName = watch('name');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Nom</label>
      <input
        placeholder="Name"
        {...register('name', { required: true })}
        aria-invalid={errors.name ? 'true' : 'false'}
      />
      {watchName && <span role="alert">Watching: {watchName}</span>}
      {errors.name && <span role="alert">Invalid name</span>}
      <br />
      <label htmlFor="version">Version</label>
      <input
        placeholder="Version (numerical)"
        {...register('version', { pattern: /^[0-9]+$/, required: true })}
        aria-invalid={errors.version ? 'true' : 'false'}
      />
      {errors.version && <span role="alert">Invalid version</span>}
      <br />
      <input type="reset" onClick={() => reset()} value="Annuler" />
      <input type="submit" value="Créer" />
    </form>
  );
}
