const debounce = (fun:(textQuery: string) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (textQuery: string) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fun(textQuery)
    }, delay)
  }
}


export default debounce;