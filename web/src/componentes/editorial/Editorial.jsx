import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

function Editorial() {
    
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    const [editorial,setEditorial] = useState({
        nombre : ''
    })

    const [editoriales, setEditoriales] = useState([]);
    const [editorialSeleccionada, setEditorialSeleccionada] = useState({})
    const [visible, setVisible] = useState(false)
  
    useEffect(() => {
      fetch("http://localhost:3000/editorial",{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
        .then((res) => res.json())
        .then((editoriales) => setEditoriales(editoriales));
        
    }, []);

    useEffect(() => {
      !localStorage.getItem("token") ? navigate('/login',{ replace: true }) : null
    }, []);
  
    const clickEditorial = async (editorial) => {
      setEditorialSeleccionada(editorial.id_editorial)
      setEditorial(editorial)
      setVisible(true)
    };

    function mensajeError(){
      let mensaje = "Ha ocurrido un error"
      editorial.nombre == '' ? mensaje = mensaje + "\n Nombre vacio" : null
      return mensaje
    }
    
  
    const eliminarEditorial = async (editorialId) => {
      if (window.confirm("¿Desea eliminar ?")) {
        const res = await fetch(`http://localhost:3000/editorial/${editorialId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`},
        });
  
        if (res.ok) {
          setEditoriales(editoriales.filter((editorial) => editorial.id_editorial !== editorialId));
        } else {
          alert("Fallo al quitar editorial");
        }
      }
      limpiarForm()
      setVisible(false)
    };
  
    const agregarEditorial = async () => {
      const res = await fetch("http://localhost:3000/editorial", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          editorial: {
            nombre: editorial.nombre,
          },
        }),
      });
  
      if (res.ok) {
        const editorialNuevo = await res.json();
        fetch("http://localhost:3000/editorial",{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` 
          }
        })
          .then((res) => res.json())
          .then((editoriales) => { setEditoriales(editoriales)});
          limpiarForm()
          setVisible(false)
      } else {
        alert(mensajeError())
      }
    };
  
    const edicionEditorial = async () => {
      if (window.confirm("¿Desea Editar ?")) {
        const res = await fetch(`http://localhost:3000/editorial/${editorialSeleccionada}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            editorial: { 
              nombre: editorial.nombre
            },
          }),
        });
        if (res.ok) {
          setEditoriales(
            editoriales.map((item)=> item.id_editorial == editorialSeleccionada?editorial:item)
          )
          limpiarForm()
          setVisible(false)
        } else {
          alert("Error al editar la editorial.");
        }
      }
  
    }
    const cancelarEdicion = () => {
      limpiarForm();
      setVisible(false);
    };
  
    
    function limpiarForm() {
      setEditorial({
        nombre: ''
      })
      setVisible(false)
    }

    return (
        <>
            <main className="md:w-3/5  xl:w-4/5 px-5 py-10 bg-gray-200">
                <h2 className="text-3xl font-light text-center">Nueva Editorial</h2>
                <div className="flex flex-col mt-10 items-center">
                    <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 w-10/12 md:w-8/12 lg:w-6/12">
                        <div className=" shadow overflow-hidden sm:rounded-lg border-b border-gray-200 ">
                            <div id="formulario" className="bg-white p-3">
                                {/* Input */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Editorial">Nombre:</label>
                                    <input
                                        onChange={(e)=>{setEditorial({...editorial, nombre: e.target.value})}}
                                        value={editorial.nombre}
                                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="Nombre"
                                        name="Nombre"
                                        type="text"
                                        placeholder="Ingresar nombre de la editorial"
                                    />
                                </div>
                                

                                {visible ? (
                            <input
                              onClick={edicionEditorial}
                              type="submit"
                              className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Editar Editorial"
                            />
                          ) : (
                            <input
                              onClick={agregarEditorial}
                              type="submit"
                              className="bg-teal-600 hover:bg-teal-900 w-full mt-5 p-2 text-white uppercase font-bold"
                              value="Agregar Editorial"
                            />
                          )}
                            {visible && (
                            <input
                              type="submit"
                              onClick={cancelarEdicion}
                              className="bg-gray-500 hover:bg-gray-700 text-white w-full mt-5 p-2 uppercase font-bold"
                              value="Cancelar"
                            />
                            )}
                                {/* /Botón  Editar*/}
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-light text-center mt-20">Listado de Editoriales</h2>
                <div className="flex flex-col mt-10">
                    <div className="py-2 overflow-x-auto">
                        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                            <table className="min-w-full">
                                <thead className="bg-gray-100 ">
                                    <tr>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                {/* Inicio del Listado */}
                                <tbody id="listado-Editoriales" className="bg-white">
                                    {/* Inicio del Item del Listado */}
                                    {
                                    editoriales.map((item,index)=>(
                                        <tr key={item.id_editorial}>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                {item.nombre}
                                            </th>
                                            <th className="px-6 py-3 border-b border-gray-200  text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                                <span className="cursor-pointer" onClick={()=>{eliminarEditorial(item.id_editorial)}}>🗑️</span>
                                                <span className="cursor-pointer"  onClick={()=>{clickEditorial(item)}}>📝</span>
                                            </th>
                                        </tr>
                                     ))}
                                    {/* Fin del Item del Listado */}
                                </tbody>
                                {/* Fin del Listado */}
                            </table>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}

export default Editorial
