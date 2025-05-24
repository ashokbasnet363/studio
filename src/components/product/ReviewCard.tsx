
import type { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            {/* For real avatars, you'd use review.userAvatarUrl or similar */}
            <AvatarImage src={`https://placehold.co/40x40.png?text=${review.userName.charAt(0)}`} alt={review.userName} data-ai-hint="user avatar" />
            <AvatarFallback>{review.userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-md font-semibold">{review.userName}</CardTitle>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">{new Date(review.date).toLocaleDateString()}</p>
        <p className="text-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
