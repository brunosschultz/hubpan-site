import {
  Accessibility, Activity, Anchor, ArrowRight, ArrowUpRight, Atom, Award, BadgeCheck, Bell, Bike,
  Book, BookOpen, Bot, Boxes, Brain, BrainCircuit, Briefcase, Building, Building2, Calendar,
  Camera, ChartColumn, ChartLine, ChartPie, Check, CircleCheck, CircleDollarSign, Clock, Code,
  Coins, Compass, Cpu, CreditCard, Crown, Database, Dna, DollarSign, Download, Droplet, Earth,
  ExternalLink, Eye, Factory, FileText, Film, Flag, Flame, FlaskConical, Folder, Gem, Gift,
  GraduationCap, Globe, Handshake, Heart, HeartHandshake, HeartPulse, Home, Image, Infinity as InfinityIcon,
  Key, Landmark, Laptop, Layers, Leaf, Library, Lightbulb, Lock, Mail, Map, MapPin, Medal,
  Megaphone, MessageCircle, Mic, Microscope, Monitor, Mountain, Navigation, Network, Newspaper,
  Package, PersonStanding, Phone, Plane, Plus, Puzzle, Recycle, RefreshCw, Rocket, Scale, School,
  Search, Send, Server, Settings, Share2, Shield, ShieldCheck, Ship, Smartphone, Smile, Sparkles,
  Sprout, Star, Stethoscope, Store, Sun, Target, Telescope, ThumbsUp, Trees, TrendingUp, Trophy,
  Upload, User, UserCheck, UserPlus, Users, Video, Wallet, Warehouse, Waves, Wrench, Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Catálogo curado de ícones Lucide disponíveis no picker do editor.
 * Import estático nomeado — só estes entram no bundle (tree-shaking preservado).
 * Chaves em kebab-case, iguais aos nomes oficiais do Lucide.
 */
export const LUCIDE_CHOICES: Record<string, LucideIcon> = {
  'landmark': Landmark, 'building': Building, 'building-2': Building2, 'school': School,
  'graduation-cap': GraduationCap, 'book-open': BookOpen, 'book': Book, 'library': Library,
  'globe': Globe, 'earth': Earth, 'map': Map, 'map-pin': MapPin, 'navigation': Navigation,
  'compass': Compass, 'flag': Flag, 'rocket': Rocket, 'lightbulb': Lightbulb, 'brain': Brain,
  'brain-circuit': BrainCircuit, 'cpu': Cpu, 'bot': Bot, 'sparkles': Sparkles, 'star': Star,
  'heart': Heart, 'heart-handshake': HeartHandshake, 'handshake': Handshake, 'users': Users,
  'user': User, 'user-plus': UserPlus, 'user-check': UserCheck, 'network': Network,
  'share-2': Share2, 'briefcase': Briefcase, 'trophy': Trophy, 'award': Award, 'medal': Medal,
  'target': Target, 'trending-up': TrendingUp, 'chart-column': ChartColumn, 'chart-line': ChartLine,
  'chart-pie': ChartPie, 'activity': Activity, 'zap': Zap, 'flame': Flame, 'sun': Sun,
  'database': Database, 'server': Server, 'code': Code, 'laptop': Laptop, 'monitor': Monitor,
  'smartphone': Smartphone, 'camera': Camera, 'image': Image, 'film': Film, 'video': Video,
  'mic': Mic, 'newspaper': Newspaper, 'file-text': FileText, 'folder': Folder,
  'calendar': Calendar, 'clock': Clock, 'mail': Mail, 'send': Send, 'message-circle': MessageCircle,
  'phone': Phone, 'bell': Bell, 'megaphone': Megaphone, 'search': Search, 'eye': Eye,
  'shield': Shield, 'shield-check': ShieldCheck, 'lock': Lock, 'key': Key, 'check': Check,
  'circle-check': CircleCheck, 'plus': Plus, 'arrow-right': ArrowRight, 'arrow-up-right': ArrowUpRight,
  'external-link': ExternalLink, 'download': Download, 'upload': Upload, 'refresh-cw': RefreshCw,
  'settings': Settings, 'wrench': Wrench, 'puzzle': Puzzle, 'package': Package, 'gift': Gift,
  'credit-card': CreditCard, 'wallet': Wallet, 'dollar-sign': DollarSign, 'coins': Coins,
  'circle-dollar-sign': CircleDollarSign, 'scale': Scale, 'leaf': Leaf, 'sprout': Sprout,
  'recycle': Recycle, 'droplet': Droplet, 'mountain': Mountain, 'waves': Waves, 'anchor': Anchor,
  'plane': Plane, 'ship': Ship, 'bike': Bike, 'accessibility': Accessibility,
  'person-standing': PersonStanding, 'smile': Smile, 'thumbs-up': ThumbsUp, 'infinity': InfinityIcon,
  'atom': Atom, 'flask-conical': FlaskConical, 'microscope': Microscope, 'telescope': Telescope,
  'dna': Dna, 'stethoscope': Stethoscope, 'heart-pulse': HeartPulse, 'layers': Layers,
  'boxes': Boxes, 'factory': Factory, 'store': Store, 'home': Home, 'warehouse': Warehouse,
  'trees': Trees, 'badge-check': BadgeCheck, 'crown': Crown, 'gem': Gem,
};

export const LUCIDE_NAMES = Object.keys(LUCIDE_CHOICES);
