import { Header } from '@/app/_components/header';
import { Footer } from '@/app/_components/footer';
import { AdminClient } from './_components/admin-client';

export default function AdminPage() {
  return (
    <>
      <Header />
      <AdminClient />
      <Footer />
    </>
  );
}
