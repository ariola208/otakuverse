export function ArticleSkeleton() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a]">
      <div className="h-48 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-full" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="flex justify-between">
          <div className="h-3 skeleton rounded w-1/4" />
          <div className="h-3 skeleton rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return <div className="h-96 skeleton rounded-2xl" />;
}

export function ArticlePageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="h-8 skeleton rounded w-3/4" />
      <div className="h-4 skeleton rounded w-1/4" />
      <div className="h-72 skeleton rounded-xl" />
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-4 skeleton rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}
