export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#00558C] to-[#3B2447]">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#81C7EA] mx-auto"></div>
        <p className="mt-6 text-lg italic text-gray-300">
          Cargando...
        </p>
      </div>
    </div>
  )
}
