export const messages = {
  English: {
    name: 'English',
    components: {
      authorTable: {
        keywordSearch: 'Keyword Search',
        new: 'New',
        name: 'Name',
        lastName: 'Last Name',
        cancel: 'Cancel',
        delete: 'Delete',
        save: 'Save',
        saving: 'Saving...',
        authorUpdated: 'Author updated successfully',
        authorCreated: 'Author created successfully',
        unknowError: 'An unknown error has ocurred',
        newAuthorTitle: 'New Author',
        newAuthorSubtitle: "Enter the author's information",
        editAuthorTitle: 'Edit Author',
        editAuthorSubtitle: "Edit the author's information",
        messageDelete: 'Do you want to delete this author?',
        headerDelete: 'Delete author',
        summaryDeleted: 'Deleted',
        detailDeleted: 'The author was deleted',
        summaryCanceled: 'Canceled',
        detailCanceled: 'The operation was canceled',
        errorName: 'Name should not be empty',
        errorLastName: 'Last name should not be empty',
      },
      booksByAuthor: {
        title: "Books By Author Report",
        subtitle: 'In this report you can view the books belonging to any author you select, as long as it is previously registered.',
        labelExport: 'Export as PDF',
        errorAuthor: 'Select an author',
      },
      
      booksBySubject: {
        title: "Books By Subject Report",
        subtitle: 'In this report you can view the books belonging to any subject you select, as long as it is previously registered.',
        labelExport: 'Export as PDF',
        errorSubject: 'Select a subject',
      },
      
      usersLoans: {
        title: "User's Loans Report",
        subtitle: 'In this report you can view the loans belonging to any user you select, as long as it is previously registered.',
        labelExport: 'Export as PDF',
        errorLoans: 'Select an user',
      },

    },
    views: {
      home: {
        nav: {
          home: 'Home',
          books: 'Books',
          authors: 'Authors',
          subjects: 'Subjects',
          bookCopy: 'Book Copies',
          loans: 'Loans',
          sanctions: 'Sanctions',
          users: 'Users',
          reports: 'Reports'
        },
        message: 'Index',
      },
    },
  },
  Español: {
    name: 'Español',
    components: {
      authorTable: {
        keywordSearch: 'Buscar',
        new: 'Nuevo',
        name: 'Nombre',
        lastName: 'Apellidos',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        save: 'Guardar',
        saving: 'Guardando...',
        authorUpdated: 'Autor actualizado con éxito',
        authorCreated: 'Autor creado con éxito',
        unknowError: 'Ha ocurrido un error desconocido',
        newAuthorTitle: 'Nuevo Autor',
        newAuthorSubtitle: 'Ingrese la información del autor',
        editAuthorTitle: 'Editar Autor',
        editAuthorSubtitle: 'Edite la información del autor',
        messageDelete: '¿Desea eliminar este autor?',
        headerDelete: 'Eliminar Autor',
        summaryDeleted: 'Eliminado',
        detailDeleted: 'El autor fue eliminado',
        summaryCanceled: 'Cancelado',
        detailCanceled: 'La operación fue cancelada',
        errorName: 'El nombre no puede estar vacío',
        errorLastName: 'Los apellidos no pueden estar vacíos',
      },
      booksByAuthor: {
        title: "Reporte de Libros pertenecientes a un autor",
        subtitle: 'En este reporte usted puede observar los libros pertenecientes a cualquier autor que seleccione, siempre y cuando esté registrado previamente.',
        labelExport: 'Exportar a PDF',
        errorAuthor: 'Seleccione un autor'
      },
      
      booksBySubject: {
        title: "Reporte de Libros pertenecientes a una materia",
        subtitle: 'En este reporte usted puede observar los libros pertenecientes a cualquier materia que seleccione, siempre y cuando esté registrado previamente.',
        labelExport: 'Exportar a PDF',
        errorSubject: 'Seleccione una materia'
      },
      usersLoans: {
        title: "Reporte de Préstamos pertenecientes a un usuario",
        subtitle: 'En este reporte usted puede observar los préstamos del usuario que seleccione, siempre y cuando esté registrado previamente.',
        labelExport: 'Exportar a PDF',
        errorLoans: 'Seleccione un usuario',
      },
    },
    views: {
      home: {
        nav: {
          home: 'Inicio',
          books: 'Libros',
          authors: 'Autores',
          subjects: 'Materias',
          bookCopy: 'Ejemplares',
          loans: 'Préstamos',
          sanctions: 'Sanciones',
          users: 'Usuarios',
          reports: 'Reportes'
        },
        message: 'Inicio',
      },
    },
  },
};
