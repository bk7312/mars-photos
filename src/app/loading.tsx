import Spinner from '@/components/Spinner';

export default function Loading() {
  return (
    <div>
      <p className='hidden motion-reduce:block'>Loading...</p>
      <Spinner className='motion-reduce:hidden' />
    </div>
  );
}
