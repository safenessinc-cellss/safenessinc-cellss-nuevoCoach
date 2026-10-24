import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CurriculumShowcaseModal from '../components/CurriculumShowcaseModal';

/**
 * Public, shareable curriculum page. It reuses the same curriculum data,
 * language selector and PDF export used by the homepage showcase.
 */
export default function PublicCurriculumPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Currículo completo y credenciales | Coach ISO';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#06050a]">
      <CurriculumShowcaseModal
        isOpen
        onClose={() => navigate('/')}
      />
    </main>
  );
}
