import { useAuthContext } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function BarraLateral() {

  const { logout } = useAuthContext(); 

  const navigate = useNavigate();
  
  const checkRol = () =>{
    if (localStorage.getItem("token")!= undefined){
      return jwtDecode(localStorage.getItem("token")).rol
    }else{
      return 'Sin Rol'
    } 
  }

  const rol = () => {
    let perfilToken = {}
    if (localStorage.getItem("token") != undefined){
      perfilToken = jwtDecode(localStorage.getItem("token"))
      return `(Rol: ${perfilToken.rol})`
    }else{
      return ''
    }
  }

  const username = () => {
    let perfilToken = {}
    if (localStorage.getItem("token") != undefined){
      perfilToken = jwtDecode(localStorage.getItem("token"))
      return `${perfilToken.username}`
    }else{
      return ''
    }
  }
  
  const onLogout = () => {
    logout(()=> navigate("/login", { replace: true }))
  }

  return (
    <>
    <aside className="md:w-2/5 lg:w-2/5 xl:w-1/5 bg-teal-600 px-5 py-10">
            <h1 className="uppercase text-white tracking-wide text-2xl  font-bold mt-2">- ISAE - 📚</h1>
            <br></br>
            <span className="text-white mb-10">
              Bienvenido <b>{username()}</b> <br></br> {rol()}
            </span>
            <br></br>
            <h1 className="mt-10 text-white"><b>MENU</b></h1><br></br>
            <a  href="/" 
                className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
            >Home</a>

            { (checkRol() == "Vendedor" || checkRol() == "Administrador") && (<a  
                href="/ventas" 
                className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
            >Nueva Venta</a>)}

            { (checkRol() == "Administrador" || checkRol() == "Repositor") && (<a  
                href="/stock" 
                className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
            >Cargar Stock</a>)}

            <nav className="mt-8">
               
               { checkRol() == "Administrador" && (<a  
                    href="/autores" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Autores </a>)}

               { checkRol() == "Administrador" && ( <a  
                    href="/categorias" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Categorias</a>)}

                { checkRol() == "Administrador" && (<a  
                    href="/editorial" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Editoriales</a>)}

               { checkRol() == "Administrador" && ( <a  
                    href="/libros" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Libros</a>)}

                { (checkRol() == "Administrador" || checkRol() == "Vendedor") && (<a  
                    href="/personas" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Personas</a>)}
                
                { (checkRol() == "Administrador" || checkRol() == "Repositor") &&(<a  
                    href="/proveedores" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Proveedores</a>)}
                
                { checkRol() == "Administrador" && (<a  
                    href="/roles" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Roles</a>)}
                
                { checkRol() == "Administrador" && (<a  
                    href="/usuarios" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Usuarios</a>)}

                { (checkRol() == "Vendedor" || checkRol() == "Administrador") && (<a  
                    href="/listado-ventas" 
                    className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
                >Ventas</a>)}

            </nav>
          <a style={{'background':'none', 'marginTop':'100px'}} 
          href="#"
          onClick={()=>{onLogout()}}
          className="px-3 py-1 text-white block hover:bg-teal-700 hover:text-yellow-400 bg-teal-700"
        >🔒 Cerrar Sesión</a>
    </aside>
    </>
  )
}

export default BarraLateral
