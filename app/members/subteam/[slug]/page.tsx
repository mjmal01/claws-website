interface Props { params: { slug: string } }
export default function SubteamPage({ params }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-white-50">Subteam: {params.slug}</p>
    </div>
  )
}
