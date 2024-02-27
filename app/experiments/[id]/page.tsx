export default function Page({ params }: { params: { id: string } }) {
  return <div>My Experiment: {params.id}</div>;
}
