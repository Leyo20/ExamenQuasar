import{api} from 'src/boot/axios'
import type { materiasinterface } from 'src/interfaces/materias.interface'

export function getlist() {
    return api.get('/obtener')
}

export function Createmateria(data:materiasinterface){
    delete data.id
    return api.post('agregar',data)
}

export function Updatemateria(data: materiasinterface){
    const id = data.id
    delete data.id
    return api.put(`/actualizar/${id}`,data)
}

export function deletemateria(id: number){
    return api.delete(`/eliminar/${id}`)
}
