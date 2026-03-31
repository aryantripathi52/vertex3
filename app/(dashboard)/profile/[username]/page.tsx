export default function UserProfilePage({ params }: { params: { username: string } }) {
  return <div>Profile: {params.username}</div>;
}
