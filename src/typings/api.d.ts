/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      userId: string;
      userName: string;
      title: string;
      roles: string[];
      buttons: string[];
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /** role */
    type Role = Common.CommonRecord<{
      /** role name */
      roleName: string;
      /** role code */
      roleCode: string;
      /** role description */
      roleDesc: string;
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'roleName' | 'roleCode' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'roleName' | 'roleCode'>;

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '1' | '2';

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      userName: string;
      /** user gender */
      userGender: UserGender | null;
      /** user nick name */
      nickName: string;
      /** user phone */
      userPhone: string;
      /** user email */
      userEmail: string;
      /** user role code collection */
      userRoles: string[];
    }>;

    type equipmentType = Common.CommonRecord<{
      id : string;
    }>;

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'status'> &
        CommonSearchParams
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;



    /** crop type */
    type CropType = Common.CommonRecord<{
      /** crop type name */
      cropTypeName: string;
      /** crop type code */
      cropTypeCode: string;
    }>;

    /** crop type search params */
    type CropTypeSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.CropType, 'cropTypeName' | 'cropTypeCode'> &
        CommonSearchParams
    >;

    /** crop type list */
    type CropTypeList = Common.PaginatingQueryRecord<CropType>;


    /** crop */
    type Crop = Common.CommonRecord<{
      /** crop name */
      cropName: string;
      /** crop code */
      cropCode: string;
      /** crop type */
      type: string;
      /** crop org name */
      orgName: string;
      /** crop img */
      cropImg: string;
    }>;

    /** crop search params */
    type CropSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Crop, 'cropName' | 'cropCode' | 'type' | 'orgName' | 'cropImg'> &
        CommonSearchParams
    >;

    /** crop list */
    type CropList = Common.PaginatingQueryRecord<Crop>;


    /** land */
    type Land = Common.CommonRecord<{
      /** land name */
      landName: string;
      /** land code */
      address: string;
      /** land type */
      farm: string;
      /** staff number */
      staffNum: string;
      /** device number */
      deviceNum: string;
      /** land crop */
      crop: string;
      /** land state */
      state: string;
    }>;

    /** land search params */
    type LandSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Land, 'landName' | 'address' | 'farm' | 'staffNum' | 'deviceNum' | 'crop' | 'state'> &
        CommonSearchParams
    >;

    /** land list */
    type LandList = Common.PaginatingQueryRecord<Land>;


    /** Irrigation Review */
    type IrrigationReview = Common.CommonRecord<{
      /** Applied Person name */
      applyPerson: string;
      /** Applied land */
      applyLand: string[];
      /** Irrigation time : start time, finish time */
      irrigationTime: [number, number];
      /** Irrigation Review state */
      state: string;
      /** Irrigation Reviewer */
      reviewer:string;
      /** review time */
      reviewTime: number;
      /** review feedback */
      reviewFeedback: string;
    }>;

    /** IrrigationReview search params */
    type IrrigationReviewSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.IrrigationReview, 'applyLand' | 'state' | 'irrigationTime'> &
        CommonSearchParams
    >;

    /** IrrigationReview list */
    type IrrigationReviewList = Common.PaginatingQueryRecord<IrrigationReview>;

    /** notice */
    type Notice = Common.CommonRecord<{
      /** notice  title*/
      title: string;
      /** notice state */
      state: string;
      /** notice start-finish-time*/
      startToFinish: [number, number];

      content: string;
      PushHierarchy: string[];
      publisher: string;
      opTime: number;
    }>;

    /** Notice search params */
    type NoticeSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Notice, 'title' | 'state' | 'startToFinish'> &
        CommonSearchParams
    >;

    /** Notice list */
    type NoticeList = Common.PaginatingQueryRecord<Notice>;

    /** Irrigation */
    type Irrigation = Common.CommonRecord<{
      /** Irrigate farm and land */
      farmAndLand: string[];
      /** Irrigation state */
      state: string;
      /** Irrigation time*/
      irrigationTime: [number, number];
    }>;

    /** Irrigation search params */
    type IrrigationSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Irrigation, 'farmAndLand' | 'state' | 'irrigationTime'> &
        CommonSearchParams
    >;

    /** Irrigation list */
    type IrrigationList = Common.PaginatingQueryRecord<Irrigation>;


    /** fieldPatrol */
    type FieldPatrol = Common.CommonRecord<{
      /** fieldPatrol  */
      farmingName: string;
      /** fieldPatrol farm and land */
      farmAndLand: string[];
      /** fieldPatrol address */
      address: string;
      /** fieldPatrol content */
      content: string;
      /** fieldPatrol image */
      fieldPatrolImg: string;
      /** fieldPatrol publisher */
      Publisher: string;
      /** fieldPatrol state */
      state: string;
      /** fieldPatrol time*/
      fieldPatrolTime: number;
      /** fieldPatrol time quantum*/
      TimeQuantum: [number, number];
    }>;

    /** fieldPatrol search params */
    type FieldPatrolSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.FieldPatrol, 'farmAndLand' | 'state' | 'TimeQuantum'> &
        CommonSearchParams
    >;

    /** Irrigation list */
    type FieldPatrolList = Common.PaginatingQueryRecord<FieldPatrol>;


    /** seeding growth supervise */
    type SeedingGrowth = Common.CommonRecord<{
      /** seeding growth  */
      farmingName: string;
      /** seeding growth farm and land */
      farmAndLand: string[];
      /** seeding growth address */
      address: string;
      /** seeding growth content */
      content: string;
      /** seeding growth image */
      seedingGrowthImg: string;
      /** seeding growth publisher */
      Publisher: string;
      /** seeding growth state */
      state: string;
      /** seeding growth time*/
      seedingGrowthTime: number;
      /** seeding growth time quantum*/
      TimeQuantum: [number, number];
    }>;

    /** seeding growth search params */
    type SeedingGrowthSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.SeedingGrowth, 'farmAndLand' | 'state' | 'TimeQuantum'> &
        CommonSearchParams
    >;

    /** seeding growth list */
    type SeedingGrowthList = Common.PaginatingQueryRecord<SeedingGrowth>;


    /** oracle job supervise */
    type OracleJob = Common.CommonRecord<{
      /** oracle job name  */
      jobName: string;
      /** oracle job state  */
      state: string;
      /** oracle job start-finish-time*/
      startToFinish: [number, number];
      /** oracle job Operating cycle*/
      cycle: string[];
      /** oracle job Operating period*/
      timeQuantum: [number, number];
      /** oracle job land number */
      LandNum: number;
      /** oracle job device number */
      deviceNum: number;
    }>;

    /** oracle job search params */
    type OracleJobSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.OracleJob, 'jobName' | 'state' | 'startToFinish'> &
        CommonSearchParams
    >;

    /** oracle job search list */
    type OracleJobSearchList = Common.PaginatingQueryRecord<OracleJob>;


    /**
     * menu type
     *
     * - "1": directory
     * - "2": menu
     */
    type MenuType = '1' | '2';

    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'order'
      | 'href'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: number;
      /** menu type */
      menuType: MenuType;
      /** menu name */
      menuName: string;
      /** route name */
      routeName: string;
      /** route path */
      routePath: string;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** buttons */
      buttons?: MenuButton[] | null;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    type MenuTree = {
      id: number;
      label: string;
      pId: number;
      children?: MenuTree[];
    };
  }
}
