import { Phone } from 'lucide-react';
import { Card } from '../ui/Card';

export function CrisisCard() {
  return (
    <Card className="p-4 bg-rose-50 border border-rose-200 shadow-sm mt-4">
      <div className="flex items-start gap-3">
        <div className="bg-rose-100 p-2 rounded-full shrink-0">
          <Phone className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="font-semibold text-rose-800">You don't have to face this alone.</h3>
          <p className="text-sm text-rose-700 mt-1 mb-3">
            It sounds like you're going through a really tough time. If you feel unsafe or overwhelmed, please reach out for professional help immediately.
          </p>
          <a
            href="tel:9152987821"
            className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call iCall: 9152987821
          </a>
        </div>
      </div>
    </Card>
  );
}
