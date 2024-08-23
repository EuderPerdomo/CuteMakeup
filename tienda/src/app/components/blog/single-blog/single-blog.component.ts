import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GuestService } from '../../../service/guest.service';
import { ClienteService } from '../../../service/cliente.service';
import { Blog } from '../../../interfaces/blog';
import { NavComponent } from "../../nav/nav.component";
import { FooterComponent } from "../../footer/footer.component";
import { FormsModule,FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var tns: any
declare var lightGallery: any
declare var iziToast: any
declare var $: any


@Component({
  selector: 'app-single-blog',
  standalone: true,
  //NavComponent,FooterComponent, FormsModule, CommonModule,NgbPaginationModule,RouterModule
  imports: [NavComponent, FooterComponent,FormsModule,CommonModule,RouterModule],
  templateUrl: './single-blog.component.html',
  styleUrl: './single-blog.component.css'
})
export class SingleBlogComponent implements AfterViewInit {
public data_slider=false
public token:any
public slug: any
public slider:any
  //recomendados
  public postsRecomendados: Array<any> = []
  public load_btn=false

public post: Blog = {
  titulo: '',
  slug: '',
  categoria: { titulo: '', slug: '', _id: '' },
  contenido: '',
  portada: '',
  fecha:'',
  autor:'',
  comentarios:[],
  createdAt:'',
  _id:''
}


public comentario = {
 nombre:'',
 email:'',
 comentario:''
};

comentarioForm!:FormGroup


  constructor(
    private _route: ActivatedRoute,
    private _guestService: GuestService,
    private cdr: ChangeDetectorRef,
    private _clienteService: ClienteService,
  ) {
    this.token = localStorage.getItem('token')
    this.postsRecomendados=[]

    this._route.params.subscribe(
      params => {
        this.slug = params['slug']
        this._guestService.obtener_post_public(this.slug).subscribe(
          response => {
            this.post = response.data
console.log('post consultado',this.post)
            this._guestService.listar_post_recomendado_public(this.post.categoria._id,this.post._id).subscribe(
              response => {
                this.postsRecomendados = response.data
console.log('Recomendados',this.postsRecomendados)
this.initSlider()
              }
            )

          }

        )


      }
    )

//Inicio formulario de Comentario

this.comentarioForm=new FormGroup({
  nombre: new FormControl(this.comentario.nombre, [
    Validators.required,
    Validators.minLength(4),
  ]),
  
  email: new FormControl(this.comentario.email, [
    Validators.required,
    Validators.email,
  ]),

  comentario: new FormControl(this.comentario.comentario, [
    Validators.required,
    Validators.maxLength(500),
  ]),


})

  }

  ngAfterViewInit(): void {
    /*
    setTimeout(() => { 
//Productos recomendados
      tns({
        container: '.tns-carousel-inner',
        controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        //controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 2,
            gutter: 24
          },
          1100: {
            items: 2,
            gutter: 30
          }
        }
      });

      //this.iniciarLightGalery()
      //this.initSlider(); //Inicia mi tercer carrusel
      //this.initCache();
      
    }, 500)
*/
    
  }


  initSlider(){
    console.log('Arranca inicializar slider')
    console.log(this.postsRecomendados)
    if (this.slider) {
      console.log('existe, destruyo slider')
      this.slider.destroy();
    }

setTimeout(()=>{
 this.slider= tns({
    container: '.tns-carousel-inner',
    //controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
    navPosition: "top",
    controlsPosition: "top",
    mouseDrag: !0,
    speed: 600,
    autoplayHoverPause: !0,
    autoplayButtonOutput: !1,
    nav: false,
    //controlsContainer: "#custom-controls-related",
    responsive: {
      0: {
        items: 1,
        gutter: 20
      },
      480: {
        items: 2,
        gutter: 24
      },
      700: {
        items: 2,
        gutter: 24
      },
      1100: {
        items: 2,
        gutter: 30
      }
    }
  });
},500)

console.log('Finaliza Iniciar slider')
//this.cdr.detectChanges();
  }

agregarComentario(comentarioForm:any){
  if(comentarioForm.valid){
    this.load_btn=true
    this._guestService.enviar_comentario_post_guest(this.comentario,this.post._id).subscribe(
      response=>{
        console.log(response)
    
        iziToast.show({
          title:'¡Gracias por compartir tu opinión!',
          titleColor:'#1DC74C',
          class:'text-success',
          position:'topRight',
          message:' 📝✨ Nos encanta leer lo que piensas, tu comentario le da más vida a este espacio. ¡Sigue brillando y conectando con nosotros! 💬💖'
        })
    
        this.comentario = {
          nombre:'',
          email:'',
          comentario:''
         };

    this.load_btn=false
    this.consultarComentariosPost()
      }
    )
      }else{
        iziToast.show({
          title:'¡Ups!',
          titleColor:'red',
          class:'text-danger',
          position:'topRight',
          message:'🔍 Algo no encaja. Por favor, revisa los datos antes de enviarlos. 😉' 
        })
      }
    }
  
  consultarComentariosPost(){
    console.log('Antes',this.post)
    this._guestService.obtener_comentarios_post_guest(this.post._id).subscribe(
      response => {
        this.post.comentarios = response.data//.comentarios

console.log('Despues',this.post)
      }

    )
  }

}
