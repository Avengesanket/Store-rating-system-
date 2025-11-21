import { useState, useEffect } from 'react';
import type { Store } from '../types';
import { ratingsService } from '../services/ratings.service';
import { Star, X } from 'lucide-react';

interface Props {
  store: Store;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RatingModal({ store, onClose, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Load existing rating if user has already rated this store
  useEffect(() => {
    ratingsService.getMyRating(store.id).then((existing) => {
      if (existing) {
        setRating(existing.value);
      }
    });
  }, [store.id]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await ratingsService.upsert(store.id, rating);
      onSuccess(); // Refresh parent
      onClose();
    } catch (error) {
      alert('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{store.name}</h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          How was your experience? Click the stars to rate.
        </p>

        <div className="flex justify-center space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="transition-transform hover:scale-110 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star 
                size={40} 
                className={`${
                  star <= (hover || rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                } transition-colors duration-200`}
              />
            </button>
          ))}
        </div>

        <div className="flex justify-center">
           <div className="text-center mb-6 h-6 text-indigo-600 font-medium">
             {rating > 0 ? `You rated it ${rating} Stars` : "Tap a star"}
           </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}