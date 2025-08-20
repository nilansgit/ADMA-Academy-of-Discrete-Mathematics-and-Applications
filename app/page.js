// app/page.js
export default async function Home() {
  const res = await fetch("http://localhost:3000/api/hello");
  const data = await res.json();

  return <h1>{data.message}</h1>;
}
