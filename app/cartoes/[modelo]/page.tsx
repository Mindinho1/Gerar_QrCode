import { CARD_MODELS } from '@/lib/cardModels';
import ClientCardEditorPage from './ClientCardEditorPage';

export function generateStaticParams() {
  return CARD_MODELS.map((model) => ({
    modelo: model.id,
  }));
}

interface PageProps {
  params: Promise<{
    modelo: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { modelo } = await params;
  return <ClientCardEditorPage modelo={modelo} />;
}
