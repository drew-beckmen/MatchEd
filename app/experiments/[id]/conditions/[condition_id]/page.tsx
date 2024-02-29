
export default function Page({ params }: { params: { id: string, condition_id: string } }) {
    return (
        <p>My condition {params.condition_id}</p>
    );
}