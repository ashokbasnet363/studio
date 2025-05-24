
"use client";

import Link from 'next/link';
import { ShoppingBag, User as UserIcon, LogIn, LogOut, History, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBasket } from '@/context/BasketContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Navbar() {
  const { basketCount } = useBasket();
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
              <Waves className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">ShopWave</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button variant="ghost" className="text-foreground hover:text-primary">Home</Button>
            </Link>
            <Link href="/basket" passHref>
              <Button variant="ghost" className="relative text-foreground hover:text-primary">
                <ShoppingBag className="h-5 w-5" />
                {basketCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {basketCount}
                  </span>
                )}
                 <span className="ml-1 hidden sm:inline">Basket</span>
              </Button>
            </Link>
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    <UserIcon className="h-5 w-5 mr-1" /> {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/history')}>
                    <History className="mr-2 h-4 w-4" />
                    <span>Purchase History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <Link href="/auth/signin" passHref>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  <LogIn className="h-5 w-5 mr-1" /> Login
                </Button>
              </Link>
            ) : (
               <Button variant="ghost" className="text-foreground hover:text-primary" disabled>
                  <UserIcon className="h-5 w-5 mr-1" /> Loading...
                </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
