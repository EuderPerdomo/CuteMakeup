import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { ClienteService } from '../../../service/cliente.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [NavComponent,FooterComponent, FormsModule, CommonModule,NgbPaginationModule,RouterModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent {

  public categorias: Array<any> = [];
  public filtrar_categoria = ''
  public posts: Array<any> = []
  public filtro_producto = ''

  public filtro_categoria_producto = 'todos'
  public token: any

  //Precargador
  public load_data = true

  //Categoria de la ruta
  public route_categoria: any

  // Paginación
  public page = 1
  public pageSize = 5

  public sort_by = 'Defecto'

  constructor(
    private _clienteService:ClienteService,
    private _route: ActivatedRoute,
  ) {

    this.token = localStorage.getItem('token')

    this._route.params.subscribe(
      params => {
        this.route_categoria = params['categoria']
        if (this.route_categoria) {
          this._clienteService.listar_posts_public('').subscribe(
            response => {
              this.posts = response.data
              console.log(this.posts)
              this.posts = this.posts.filter(item => item.categoria.titulo == this.route_categoria)
              this.load_data = false
            },
          )

        } else {
          console.log('Post buscar no categoria')
          this._clienteService.listar_posts_public('').subscribe(
            response => {
              this.posts = response.data
              console.log(this.posts)
              this.load_data = false
            },
          )

        }
      }
    )

  }

  ngOnInit(){
    this._clienteService.get_categorias_publico().subscribe(
      response => {
        this.categorias = response.data;
      }
    );
  }




}
