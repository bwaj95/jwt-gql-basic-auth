import { useHelloQuery } from "./generated/graphql";

const App: React.FC = () => {
  // const HELLO_QUERY = gql`
  //   {
  //     hello
  //   }
  // `;

  const { loading, data } = useHelloQuery();

  if (loading || !data) {
    return <div>loading....</div>;
  }

  //return <div>{JSON.stringify(data)}</div>;
  return <div>{data.hello}</div>;
};

export default App;
