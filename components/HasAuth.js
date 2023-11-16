import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

// This is a higher-order component.
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading
      if (!session) signIn(); // Redirect to login if not authenticated
    }, [session, status]);

    if (session) {
      return <Component {...props} />;
    }

    // Return null or a loading indicator if needed.
    return null;
  };
}

// Usage: Wrap your component with `withAuth` HOC
export default withAuth(MyProtectedComponent);
