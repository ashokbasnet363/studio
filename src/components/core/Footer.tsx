
export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
        <p className="text-sm text-muted-foreground mt-1">Your Premier Online Shopping Destination</p>
      </div>
    </footer>
  );
}
