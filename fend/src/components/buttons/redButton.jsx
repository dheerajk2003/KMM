export default function RedButton(props){
    return(
        <button className="w-auto text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:bg-rose-800" 
        onClick={props.func}>{props.name}
        </button>
    );
}

export function RedSmallButton(props){
    return(
        <button className="w-auto text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-none font-medium rounded-lg text-sm px-4 py-1 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:bg-rose-800" 
        onClick={props.func}>{props.name}
        </button>
    )
}