import Image from "next/image"

interface CastMemberProps {
  name: string
  role: string
  photo: string
}

export function CastMember({ name, role, photo }: CastMemberProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2">
        <Image src={photo || "/placeholder.svg?height=100&width=100"} alt={name} fill className="object-cover" />
      </div>
      <h4 className="text-sm font-medium">{name}</h4>
      <p className="text-xs text-gray-400">{role}</p>
    </div>
  )
}
